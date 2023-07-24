import { GetServerSideProps } from "next";
import styles from "./styles.module.css";
import Head from "next/head";
import { ChangeEvent, useState, FormEvent, useEffect } from "react";

import { TextArea } from "../../components/textArea";
import { getSession } from "next-auth/react";

import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

import { db } from "../../services/firebaseConnection";
import {
   addDoc,
   collection,
   query,
   orderBy,
   where,
   onSnapshot,
   doc,
   deleteDoc,
} from "firebase/firestore";
import Link from "next/link";

interface HomeProps {
   user: {
      email: string;
   };
}

interface TasksProps {
   id: string;
   created: Date;
   public: boolean;
   tarefa: string;
   user: string;
}

export default function Dashboard({ user }: HomeProps) {
   const [input, setInput] = useState("");
   const [publicTask, setPublicTask] = useState(false);
   const [tasks, setTaks] = useState<TasksProps[]>([]);

   useEffect(() => {
      async function loadTarefas() {
         const tarefasRef = collection(db, "tarefas");
         const q = query(
            tarefasRef,
            orderBy("created", "desc"),
            where("user", "==", user?.email)
         );
         onSnapshot(q, (snapshot) => {
            let lista = [] as TasksProps[];

            snapshot.forEach((doc) => {
               lista.push({
                  id: doc.id,
                  created: doc.data().created,
                  public: doc.data().public,
                  tarefa: doc.data().tarefa,
                  user: doc.data().user,
               });
            });
            setTaks(lista);
         });
      }
      loadTarefas();
   }, [user?.email]);

   function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
      setPublicTask(e.target.checked);
      //console.log(e.target.checked);
   }

   async function handleRegistertask(e: FormEvent) {
      e.preventDefault();
      if (input === "") {
         alert("Digite uma tarefa válida");
         return;
      }
      try {
         await addDoc(collection(db, "tarefas"), {
            tarefa: input,
            created: new Date(),
            user: user?.email,
            public: publicTask,
         });

         setInput("");
         setPublicTask(false);
      } catch (err) {
         console.log(err);
      }
   }

   async function handleShare(id: string) {
      await navigator.clipboard.writeText(
         `${process.env.NEXT_PUBLIC_URL}/task/${id}`
      );
      alert("Link copiado!");
   }
   async function handleDeleteTask(id: string) {
      const docRef = doc(db, "tarefas", id);
      await deleteDoc(docRef);
   }

   return (
      <div className={styles.container}>
         <Head>
            <title>Meu painel de tarefas</title>
         </Head>
         <main className={styles.main}>
            <section className={styles.content}>
               <div className={styles.contentForm}>
                  <h1 className={styles.title}>Qual sua tarefa?</h1>

                  <form onSubmit={handleRegistertask} className={styles.form}>
                     <TextArea
                        value={input}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                           setInput(e.target.value)
                        }
                        placeholder="Digite qual sua tarefa..."
                     />
                     <div className={styles.cheackBoxArea}>
                        <input
                           onChange={handleChangePublic}
                           checked={publicTask}
                           type="checkbox"
                           className={styles.cheacbox}
                        />
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

               {tasks.map((item) => (
                  <article key={item.id} className={styles.task}>
                     {item.public && (
                        <div className={styles.tagContainer}>
                           <label className={styles.tag}>Publico</label>
                           <button
                              className={styles.shareButton}
                              onClick={() => handleShare(item.id)}
                           >
                              <FiShare2 size={22} color="#3183ff" />
                           </button>
                        </div>
                     )}
                     <div className={styles.taskContent}>
                        {item.public ? (
                           <Link href={`/task/${item.id}`}>
                              <p>{item.tarefa}</p>
                           </Link>
                        ) : (
                           <p>{item.tarefa}</p>
                        )}

                        <button
                           className={styles.trashButton}
                           onClick={() => handleDeleteTask(item.id)}
                        >
                           <FaTrash size={24} color="#ea3140" />
                        </button>
                     </div>
                  </article>
               ))}
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
      props: {
         user: {
            email: session.user.email,
         },
      },
   };
};
