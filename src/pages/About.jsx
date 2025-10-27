import styles from "./About.module.css";

function About() {
  return (
    <div className={styles.aboutSection}>
      <h2>About This App</h2>
      <p>
        This is a Book app built with React, React Router, and Airtable for persistence.
      </p>
      <p>
        Author: Natalia Novikova
      </p>
    </div>
  );
}

export default About;