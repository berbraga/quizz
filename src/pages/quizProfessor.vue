<template>
  <v-container class="d-flex align-center justify-center ma-0 pa-0" style="height: 100vh;">
    <v-card width="70%">
      <v-card-title>
        Meus Quizzes
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="quizzes" item-value="id" class="elevation-1" dense>
          <!-- Slot para customizar o cabeçalho -->
          <template v-slot:thead>
            <thead>
              <tr>
                <th v-for="header in headers" :key="header.text" :align="header.align || 'center'" class="text-center">
                  {{ header.text }}
                </th>
              </tr>
            </thead>
          </template>
          <!-- Botões e ferramentas -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Lista de Quizzes</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="goToNewQuiz">Adicionar Quiz</v-btn>
              <v-btn color="primary" @click="fetchQuizzes" class="ml-3">Atualizar</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex justify-center">
              <v-btn icon color="info" @click="goToQuizQuestions(item.id)">
                <v-icon>mdi-format-list-bulleted</v-icon>
              </v-btn>
              <v-btn icon color="error" @click="deleteQuiz(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
        <div>
          <v-btn
            style="background-color: cornflowerblue; color: white; width: 48%; font-size: 18px; padding: 12px; height: 50px;"
            block @click="goBack">
            Voltar
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // Para navegação
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase"; // Certifique-se de que está apontando para o Firestore inicializado

const router = useRouter();
const quizzes = ref([]);
const user = JSON.parse(localStorage.getItem('user'));

onMounted(() => {

const user = JSON.parse(localStorage.getItem('user'));

if (!user || user.isStudent) {
  router.push('/sem-permissao'); // Redireciona para a página de sem permissão se não for professor
}
});

// Define os cabeçalhos da tabela
const headers = [
  { text: "Nome do Quiz", value: "name", align: "center" },
  { text: "Nível", value: "level", align: "center" },
  { text: "Ações", value: "actions", align: "center" }, // Alinhamento centralizado
];

// Função para buscar os quizzes
const fetchQuizzes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "quizzes"));
    quizzes.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Quizzes carregados:", quizzes.value);
  } catch (error) {
    console.error("Erro ao carregar os quizzes:", error);
    alert("Erro ao carregar os quizzes. Tente novamente.");
  }
};

// Função para ir para a página de perguntas de um quiz
const goToQuizQuestions = (quizId) => {
  router.push(`/professor/${user.id}/quiz/${quizId}/questions`); // Redireciona para a página de perguntas
};

// Função para excluir um quiz
const deleteQuiz = async (id) => {
  const confirmDelete = confirm("Você tem certeza que deseja excluir este quiz?");
  if (confirmDelete) {
    try {
      await deleteDoc(doc(db, "quizzes", id));
      alert("Quiz excluído com sucesso!");
      fetchQuizzes(); // Atualiza a tabela após a exclusão
    } catch (error) {
      console.error("Erro ao excluir o quiz:", error);
      alert("Erro ao excluir o quiz. Tente novamente.");
    }
  }
};

// Função para ir para o formulário de novo quiz
const goToNewQuiz = () => {
  router.push(`/professor/${user.id}/novo-quiz`);
};

const goBack = () =>{
  const user = JSON.parse(localStorage.getItem('user'));

  if(user.isStudent == false){
    router.push(`/professor/${user.id}`)
  }else{
    router.push(`/aluno/${user.id}`)
  }
  
 }

// Carrega os quizzes quando o componente é montado
onMounted(fetchQuizzes);
</script>

<style scoped>
/* Estilização adicional, se necessário */
</style>
