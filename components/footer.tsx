export default function Footer({
  }: {
    studentName: "string";
    studentNumber: string;
  }) {
    const date = new Date().toLocaleDateString();
  
    return (
      <footer
        style={{
          background: "var(--footer-bg)",
          color: "var(--foreground)",
          textAlign: "center",
          padding: "16px 0",
          borderTop: "1px solid var(--border-color)",
          boxShadow: "var(--shadow)",
          fontSize: 14,
          transition: "all 0.3s ease",
        }}
      >
        © 2025 {"Michael Leonardi"} | Cloud Based Web Application | {date}
      </footer>
    );
  }
  