type BlogContentProps = {
  html: string;
};

export default function BlogContent({ html }: BlogContentProps) {
  return (
    <div
      className="blog-content flex flex-col gap-medium text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
