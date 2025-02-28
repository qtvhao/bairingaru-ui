function AppFooter() {
    return (
      <footer style={{ textAlign: "center", padding: "10px", fontSize: "12px" }}>
        Build Version: {process.env.CF_PAGES_COMMIT_SHA || "Unknown"}
      </footer>
    );
  }
  
  export default AppFooter;
  