'use client';

import { useState, useTransition } from 'react';

import BlogForm from '@/components/forms/blog-form';
import ButtonAdmin from '@/components/admin/button-admin';
import ConfirmDeleteModal from '@/components/admin/confirm-delete-modal';
import { deleteBlogAction } from '@/lib/actions/blog-actions';
import type { BlogView } from '@/types/types';

type BlogEditorProps = {
  blogs: BlogView[];
};

export default function BlogEditor({ blogs }: BlogEditorProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogView | undefined>();
  const [blogToDelete, setBlogToDelete] = useState<BlogView | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function openCreateForm() {
    setSelectedBlog(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(blog: BlogView) {
    setSelectedBlog(blog);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelectedBlog(undefined);
  }

  function openDeleteConfirm(blog: BlogView) {
    setBlogToDelete(blog);
  }

  function closeDeleteConfirm() {
    if (!isDeleting) {
      setBlogToDelete(null);
    }
  }

  function confirmDelete() {
    if (!blogToDelete) {
      return;
    }

    const formData = new FormData();
    formData.set('id', String(blogToDelete.id));

    startDeleteTransition(async () => {
      await deleteBlogAction(formData);
      setBlogToDelete(null);
    });
  }

  return (
    <div className="space-y-6">
      <ButtonAdmin type="button" onClick={openCreateForm} color="dark">
        Přidat článek
      </ButtonAdmin>

      {blogs.length === 0 ? (
        <p className="text-light">Zatím žádné články v databázi.</p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground">{blog.title}</p>
                <p className="text-sm text-light">
                  /{blog.slug}
                  {blog.slugEn ? ` · EN: /${blog.slugEn}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <ButtonAdmin
                  type="button"
                  onClick={() => openEditForm(blog)}
                  color="light"
                  className="px-3 py-1"
                >
                  Upravit
                </ButtonAdmin>
                <ButtonAdmin
                  type="button"
                  onClick={() => openDeleteConfirm(blog)}
                  color="danger"
                  className="px-3 py-1"
                >
                  Smazat
                </ButtonAdmin>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-1200 flex items-start justify-center overflow-y-auto p-4">
          <div className="fixed inset-0 bg-black/40" onClick={closeForm} />
          <div className="relative my-8 w-full max-w-3xl rounded-xl border border-border bg-background p-6 shadow-xl">
            <BlogForm onClose={closeForm} initialData={selectedBlog} />
          </div>
        </div>
      ) : null}

      <ConfirmDeleteModal
        isOpen={blogToDelete !== null}
        isPending={isDeleting}
        onCancel={closeDeleteConfirm}
        onConfirm={confirmDelete}
      >
        <p>
          Opravdu chcete smazat článek{' '}
          <strong className="text-foreground">
            „{blogToDelete?.title ?? ''}“
          </strong>
          ?
        </p>
        <p className="mt-2">
          Smaže se i náhledový obrázek a případné další soubory z obsahu
          článku.
        </p>
      </ConfirmDeleteModal>
    </div>
  );
}
