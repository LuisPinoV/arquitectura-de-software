import { Header } from './login/loginComponents/headerLogin/headerLogin';
import { Footer } from './login/loginComponents/footerLogin/footerLogin';
import LoginCard from './login/login';

import  './login/styles/loginPage.css';

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