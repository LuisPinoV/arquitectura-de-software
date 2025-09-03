import { Header } from '@/app/homeComponents/headerHomePage/headerHomePage';
import { Footer } from '@/app/homeComponents/footerHomePage/footerHomePage';
import MainHomePage from '../MainPage';
import './MainPage.css';

export default function Home() {
  return (
    <div className = "home-page-container">
      <main id = "home-main">
        <header>
          <Header/>
        </header>
        <MainHomePage />
        <footer>
          <Footer/>
        </footer>
      </main>
    </div>
  );
}
