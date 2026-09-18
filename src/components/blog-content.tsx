type BlogContentProps = {
  html: string;
};

export default function BlogContent({ html }: BlogContentProps) {
  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
