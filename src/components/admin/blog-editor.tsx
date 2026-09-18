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
    <div className="admin-block">
      <ButtonAdmin type="button" onClick={openCreateForm} color="dark">
        Přidat článek
      </ButtonAdmin>

      {blogs.length === 0 ? (
        <p className="admin-empty">Zatím žádné články v databázi.</p>
      ) : (
        <ul className="admin-list">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="admin-list__row admin-list__row--spread"
            >
              <div className="admin-list__body">
                <p className="admin-list__title">{blog.title}</p>
                <p className="admin-list__meta">
                  /{blog.slug}
                  {blog.slugEn ? ` · EN: /${blog.slugEn}` : ''}
                </p>
              </div>
              <div className="admin-list__actions">
                <ButtonAdmin
                  type="button"
                  onClick={() => openEditForm(blog)}
                  color="light"
                  className="admin-btn--compact"
                >
                  Upravit
                </ButtonAdmin>
                <ButtonAdmin
                  type="button"
                  onClick={() => openDeleteConfirm(blog)}
                  color="danger"
                  className="admin-btn--compact"
                >
                  Smazat
                </ButtonAdmin>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isFormOpen ? (
        <div className="admin-modal">
          <div className="admin-modal__backdrop" onClick={closeForm} />
          <div className="admin-modal__panel">
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
