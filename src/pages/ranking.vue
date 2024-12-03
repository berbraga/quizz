<template lang="pug">
v-container(class="d-flex flex-column align-center justify-center ma-0 pa-0" style="height: 85vh;")  
  v-card(class="pa-0 mt-6 d-flex flex-column" elevation="3" style="width: 700px; max-width: 90%; min-height: 100px;")
    v-card-title(class="d-flex justify-center text-white ma-0 text-h5 bg-primary") Ranking dos Alunos
    v-data-table(
      :headers="headers"
      :items="ranking"
      item-value="position"
      class="elevation-1"
    )
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchAllQuizzes, fetchAllUsers } from "@/services/firebase"; // Funções de busca para Firestore.

const ranking = ref([]);
const headers = [
  { text: "Posição", value: "position", align: "start" },
  { text: "Nome do Usuário", value: "name", align: "start" },
  { text: "Acertos Totais", value: "correct" },
  { text: "Erros Totais", value: "incorrect" },
  { text: "Acurácia (%)", value: "accuracy" },
];

// Função para calcular a acurácia
const calculateAccuracy = (correct, incorrect) => {
  const total = correct + incorrect;
  return total > 0 ? ((correct / total) * 100).toFixed(2) : "0.00";
};

// Função para carregar os dados do Firestore e processar o ranking
onMounted(async () => {
  try {
    const [quizzes, users] = await Promise.all([fetchAllQuizzes(), fetchAllUsers()]);

    // Mapeia os usuários por ID para facilitar a busca do nome
    const userMap = users.reduce((map, user) => {
      map[user.id] = user.name;
      return map;
    }, {});

    // Objeto para acumular resultados dos usuários
    const userResults = {};

    quizzes.forEach((quiz) => {
      quiz.results.forEach((result) => {
        const userId = result.userId;
        if (!userResults[userId]) {
          userResults[userId] = {
            name: userMap[userId] || "Usuário Desconhecido", // Nome do usuário ou fallback
            correct: 0,
            incorrect: 0,
          };
        }
        userResults[userId].correct += result.correct;
        userResults[userId].incorrect += result.incorrect;
      });
    });

    // Transforma o objeto acumulado em um array e calcula a acurácia
    const userArray = Object.entries(userResults).map(([userId, data]) => ({
      userId,
      name: data.name,
      correct: data.correct,
      incorrect: data.incorrect,
      accuracy: parseFloat(calculateAccuracy(data.correct, data.incorrect)),
    }));

    // Ordena o ranking pela acurácia em ordem decrescente
    ranking.value = userArray
      .sort((a, b) => b.accuracy - a.accuracy)
      .map((user, index) => ({
        ...user,
        position: index + 1, // Adiciona a posição no ranking
      }));
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
  }
});
</script>
