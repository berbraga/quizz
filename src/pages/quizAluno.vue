<template>
  <v-container class="d-flex align-center justify-center ma-0 pa-0" style="height: 100vh;">
    <v-card width="70%">
      <v-card-title>
        Bem-vindo, Aluno
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="quizzes" item-value="id" class="elevation-1" dense>
          <template v-slot:thead>
            <thead>
              <tr>
                <th v-for="header in headers" :key="header.text" :align="header.align || 'center'" class="text-center">
                  {{ header.text }}
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Selecione um Quiz</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="fetchQuizzes">Atualizar</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex justify-center">
              <v-btn color="success" @click="goToQuiz(item.id)">
                Responder Quiz
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
import { useRouter } from "vue-router";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/services/firebase";

const router = useRouter();

// Estado para armazenar quizzes
const quizzes = ref([]);
const user = JSON.parse(localStorage.getItem("user")); // Usuário logado

// Cabeçalhos da tabela
const headers = [
  { text: "Nome do Quiz", value: "name", align: "center" },
  { text: "Nível", value: "level", align: "center" },
  { text: "Ações", value: "actions", sortable: false, align: "center" },
];

// Função para buscar quizzes disponíveis e filtrar os já respondidos
const fetchQuizzes = async () => {
  try {
    // Busca todos os quizzes disponíveis
    const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
    const allQuizzes = quizzesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filtra quizzes que o usuário ainda não respondeu
    quizzes.value = allQuizzes.filter((quiz) => {
      const results = quiz.results || []; // Verifica se há resultados
      return !results.some((result) => result.userId === user.id); // Exclui quizzes respondidos pelo usuário
    });

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

// Função para voltar
const goBack = () => {
  if (user.isStudent == false) {
    router.push(`/professor/${user.id}`);
  } else {
    router.push(`/aluno/${user.id}`);
  }
};

// Carrega os quizzes quando o componente é montado
onMounted(fetchQuizzes);
</script>

<style scoped>
/* Estilização adicional, se necessário */
</style>
