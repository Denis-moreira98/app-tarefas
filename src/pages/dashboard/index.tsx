import { GetServerSideProps } from "next";
import styles from "./styles.module.css";
import Head from "next/head";

import { TextArea } from "../../components/textArea";
import { getSession } from "next-auth/react";

import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

export default function Dashboard() {
   return (
      <div className={styles.container}>
         <Head>
            <title>Meu painel de tarefas</title>
         </Head>
         <main className={styles.main}>
            <section className={styles.content}>
               <div className={styles.contentForm}>
                  <h1 className={styles.title}>Qual sua tarefa?</h1>

                  <form className={styles.form}>
                     <TextArea placeholder="Digite qual sua tarefa..." />
                     <div className={styles.cheackBoxArea}>
                        <input type="checkbox" className={styles.cheacbox} />
                        <label>Deixar tarefa pública</label>
                     </div>
                     <button type="submit" className={styles.button}>
                        Registrar
                     </button>
                  </form>
               </div>
            </section>
            <section className={styles.taskContainer}>
               <h1>Minhas tarefas</h1>

               <article className={styles.task}>
                  <div className={styles.tagContainer}>
                     <label className={styles.tag}>Publico</label>
                     <button className={styles.shareButton}>
                        <FiShare2 size={22} color="#3183ff" />
                     </button>
                  </div>
                  <div className={styles.taskContent}>
                     <p>Minha primeira tarefa de exemplo!</p>
                     <button className={styles.trashButton}>
                        <FaTrash size={24} color="#ea3140" />
                     </button>
                  </div>
               </article>
            </section>
         </main>
      </div>
   );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
   const session = await getSession({ req });
   //console.log(session);
   if (!session?.user) {
      // Se não tem usuario vamos redirecionar para home
      return {
         redirect: {
            destination: "/",
            permanent: false,
         },
      };
   }
   return {
      props: {},
   };
};