import styles from "./App.module.css";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <div className={styles.app}>
      <Header />
      <Content />
      <Footer />
    </div>
  );
};

export default App;
