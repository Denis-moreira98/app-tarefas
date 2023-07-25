import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { FaTrash } from "react-icons/fa";

import { db } from "../../services/firebaseConnection";
import {
   doc,
   addDoc,
   collection,
   query,
   where,
   getDoc,
   getDocs,
} from "firebase/firestore";

import { TextArea } from "../../components/textArea";

interface TaskProps {
   item: {
      tarefa: string;
      created: string;
      public: boolean;
      user: string;
      taskId: string;
   };
   allComments: CommentsProps[];
}

interface CommentsProps {
   id: string;
   comment: string;
   taskId: string;
   name: string;
   user: string;
}

export default function Task({ item, allComments }: TaskProps) {
   const { data: session } = useSession();
   const [input, setInput] = useState("");
   const [comments, setComments] = useState<CommentsProps[]>(allComments || []);

   async function handleComent(e: FormEvent) {
      e.preventDefault();

      if (input === "") return;

      if (!session?.user?.email || !session?.user?.name) return;

      try {
         const docRef = await addDoc(collection(db, "comments"), {
            comment: input,
            created: new Date(),
            user: session?.user?.email,
            name: session?.user.name,
            taskId: item.taskId,
         });

         const data = {
            id: docRef.id,
            comment: input,
            user: session?.user?.email,
            name: session?.user.name,
            taskId: item.taskId,
         };
         setComments((oldItems) => [...oldItems, data]);
         setInput("");
      } catch (err) {
         console.log(err);
      }
   }

   return (
      <div className={styles.container}>
         <Head>
            <title>Detalhes da tarefa</title>
         </Head>
         <main className={styles.main}>
            <h1>Tarefa</h1>
            <article className={styles.task}>
               <p>{item.tarefa}</p>
            </article>
         </main>

         <section className={styles.commentsContainer}>
            <h2>Deixar comentário</h2>
            <form onSubmit={handleComent}>
               <TextArea
                  value={input}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                     setInput(e.target.value)
                  }
                  placeholder="digite seu comentário..."
               />
               <button disabled={!session?.user} className={styles.button}>
                  Enviar comentário
               </button>
            </form>
         </section>
         <section className={styles.commentsContainer}>
            <h2>Todos os comentários</h2>
            {comments.length === 0 && (
               <span>Nenhum comentário foi encontrado...</span>
            )}
            {comments.map((item) => (
               <article key={item.id} className={styles.comment}>
                  <div className={styles.headComment}>
                     <label className={styles.commentLabel}>{item.name}</label>
                     {item.user === session?.user?.email && (
                        <button className={styles.buttonTrash}>
                           <FaTrash size={18} color="#ea3140" />
                        </button>
                     )}
                  </div>
                  <p>{item.comment}</p>
               </article>
            ))}
         </section>
      </div>
   );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
   const id = params?.id as string;
   const docRef = doc(db, "tarefas", id);

   const q = query(collection(db, "comments"), where("taskId", "==", id));
   const snapshotComments = await getDocs(q);

   let allComments: CommentsProps[] = [];
   snapshotComments.forEach((doc) => {
      allComments.push({
         id: doc.id,
         comment: doc.data().comment,
         taskId: doc.data().taskId,
         user: doc.data().user,
         name: doc.data().name,
      });
   });
   // console.log(allComments);
   const snapshot = await getDoc(docRef);

   if (snapshot.data() === undefined) {
      return {
         redirect: {
            destination: "/",
            permanent: false,
         },
      };
   }
   if (!snapshot.data()?.public) {
      return {
         redirect: {
            destination: "/",
            permanent: false,
         },
      };
   }

   const miliseconds = snapshot.data()?.created.seconds * 1000;

   const task = {
      tarefa: snapshot.data()?.tarefa,
      public: snapshot.data()?.public,
      created: new Date(miliseconds).toLocaleDateString(),
      user: snapshot.data()?.user,
      taskId: id,
   };

   return {
      props: {
         item: task,
         allComments: allComments,
      },
   };
};
