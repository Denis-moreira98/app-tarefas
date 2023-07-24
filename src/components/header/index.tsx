import styles from "./styles.module.css";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { PiSignOutBold } from "react-icons/pi";

export function Header() {
   const { data: session, status } = useSession();

   return (
      <header className={styles.header}>
         <section className={styles.content}>
            <nav className={styles.nav}>
               <Link href="/">
                  <h1 className={styles.logo}>
                     Tarefas<span>+</span>
                  </h1>
               </Link>
               {session?.user && (
                  <Link href="/dashboard">
                     <h4 className={styles.link}>Meu painel</h4>
                  </Link>
               )}
            </nav>
            {status === "loading" ? (
               <></>
            ) : session ? (
               <div className={styles.div_user}>
                  <p>Olá, {session?.user?.name}</p>
                  <img
                     className={styles.profile}
                     src={session?.user?.image as string}
                     alt="perfil"
                  />
                  <button
                     
                     className={styles.sairButton}
                     onClick={() => signOut()}
                  >
                     <PiSignOutBold size={22} />
                  </button>
               </div>
            ) : (
               <button
                  className={styles.loginButton}
                  onClick={() => signIn("google")}
               >
                  Acessar
               </button>
            )}
         </section>
      </header>
   );
}
