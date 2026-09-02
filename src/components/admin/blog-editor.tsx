'use client';

import { useState } from 'react';

import BlogForm from '@/components/forms/blog-form';
import ButtonAdmin from '@/components/admin/button-admin';
import type { BlogView } from '@/types/types';

type BlogEditorProps = {
  blogs: BlogView[];
};

export default function BlogEditor({ blogs }: BlogEditorProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogView | undefined>();

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
              <div>
                <p className="font-medium text-foreground">{blog.title}</p>
                <p className="text-sm text-light">
                  /{blog.slug}
                  {blog.slugEn ? ` · EN: /${blog.slugEn}` : ''}
                </p>
              </div>
              <ButtonAdmin
                type="button"
                onClick={() => openEditForm(blog)}
                className="text-sm font-medium text-primary cursor-pointer hover:underline"
              >
                Upravit
              </ButtonAdmin>
            </li>
          ))}
        </ul>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-1200 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-3xl rounded-xl border border-border bg-background p-6 shadow-xl">
            <BlogForm onClose={closeForm} initialData={selectedBlog} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
