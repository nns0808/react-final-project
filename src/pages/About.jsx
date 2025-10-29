import styles from "./About.module.css";

function About() {
  return (
    <div className={styles.aboutSection}>
      <h2>About This App</h2>
      <p>
        Book List App is a React-based web application that helps users manage their personal reading collection. It allows adding, searching, sorting, editing, and rating books in a clean, intuitive interface — with data stored and synced using Airtable.
      </p>
      <p>
        Author: Natalia Novikova
      </p>
    </div>
  );
}

export default About;