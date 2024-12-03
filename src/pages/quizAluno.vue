<template>
  <v-container class="d-flex align-center justify-center ma-0 pa-0" style="height: 100vh;">
    <v-card>
      <v-card-title>
        Bem-vindo, Aluno
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="quizzes"
          item-value="id"
          class="elevation-1"
          dense
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Selecione um Quiz</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="fetchQuizzes">Atualizar</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex">
              <v-btn color="success" @click="goToQuiz(item.id)">
                Responder Quiz
              </v-btn>
              <v-spacer></v-spacer>
              <p class="ma-0">{{ item.level }}</p>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/services/firebase";

const router = useRouter();

const quizzes = ref([]);
const user = JSON.parse(localStorage.getItem('user'));
// Cabeçalhos da tabela
const headers = [
  { text: "Nome do Quiz", value: "name", align: "start" },
  { text: "Ações", value: "actions", sortable: false },
];

// Função para buscar quizzes disponíveis
const fetchQuizzes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "quizzes"));
    quizzes.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Quizzes disponíveis:", quizzes.value);
  } catch (error) {
    console.error("Erro ao carregar os quizzes:", error);
    alert("Erro ao carregar os quizzes. Tente novamente.");
  }
};

// Redirecionar para a página de perguntas do quiz selecionado
const goToQuiz = (quizId) => {
  router.push(`/aluno/${user.id}/quizAluno/quiz/${quizId}`);
};

// Carrega os quizzes quando o componente é montado
onMounted(fetchQuizzes);
</script>

<style scoped>
/* Estilização adicional, se necessário */
</style>
