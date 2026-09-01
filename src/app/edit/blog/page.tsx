import type { Metadata } from 'next';

import BlogEditor from '@/components/admin/blog-editor';
import EditShell from '@/components/admin/edit-shell';
import { GetAllBlogs } from '@/lib/actions/blog-prisma';

export const metadata: Metadata = {
  title: 'Editace | Blog',
};

export default async function EditBlogPage() {
  const blogs = await GetAllBlogs();

  return (
    <EditShell title="Blog" description="Správa blogových článků.">
      <BlogEditor blogs={blogs} />
    </EditShell>
  );
}
