interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      className={[
        "mx-auto px-4 sm:px-6",
        className ?? "max-w-5xl py-10",
      ].join(" ")}
    >
      {children}
    </main>
  );
}
