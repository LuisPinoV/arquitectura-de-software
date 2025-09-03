import { Header } from './loginComponents/headerLogin/headerLogin';
import { Footer } from './loginComponents/footerLogin/footerLogin';
import LoginCard from './login';

import  './styles/loginPage.css';

export default function Page()
{
    return(
    <div className = "login-page-container">
        <Header/>
        <main id = "login-main">
            <LoginCard/>
        </main>
        <Footer/>
    </div>
    );
}