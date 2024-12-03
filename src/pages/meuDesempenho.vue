<template lang="pug">
v-container(class="d-flex flex-column align-center justify-center ma-0 pa-0" style="height: 85vh;")  
  v-card(class="pa-0 d-flex flex-column" elevation="3" style="width: 700px; max-width: 90%; min-height: 450px;")
    v-card-title(class="d-flex justify-center text-white ma-0 text-h5 bg-primary") Meu Desempenho
    div(class="d-flex flex-column")
      v-img(src="/correto.png" alt="correto" style="height: 40px;" class="mt-5")
      p(class="text-h6 text-center mt-5 text-grey") Quantidade de acertos
      div(class="d-flex justify-center")
        p(class="text-h6 text-center mt-5 mr-5 text-black") Total de Acertos: {{ correct }}  
        p(class="text-h6 text-center mt-5 mr-5 text-black") Acurácia: {{ accuracy.toFixed(2) }}%
      
      v-img(src="/excluir.png" alt="correto" style="height: 40px;" class="mt-5")
      p(class="text-h6 text-center mt-5 text-grey") Quantidade de erros
      
      div(class="d-flex justify-center")
        p(class="text-h6 text-center mt-5 mr-5 text-black") Total de Erros: {{ incorrect }}
        p(class="text-h6 text-center mt-5 mr-5 text-black") Acurácia: {{(100 - accuracy).toFixed(2)}}%
  v-card(class="pa-0 mt-6 d-flex flex-column" elevation="3" style="width: 700px; max-width: 90%; min-height: 100px;")
    v-card-title(class="d-flex justify-center text-white ma-0 text-h5 bg-primary") Meu Histórico
    v-data-table(
      :headers="headers"
      :items="quizzes"
      item-value="id"
      class="elevation-1"
    )
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchUserResults } from "@/services/firebase";

const router = useRouter();
const quizzes = ref([]);
const correct = ref(0);
const incorrect = ref(0);
const accuracy = ref(0);

const headers = [
  { text: "Nome do Quiz", value: "name", align: "start" },
  { text: "Nível", value: "level" },
  { text: "Acertos", value: "correct" },
  { text: "Erros", value: "incorrect" },
  { text: "Acurácia (%)", value: "accuracy" },
  { text: "Data", value: "formattedDate" },
];

const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString("pt-BR");

onMounted(async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      router.push("/sem-permissao");
      return;
    }
    const results = await fetchUserResults(user.id);
    quizzes.value = results.map((quiz) => ({
      ...quiz,
      formattedDate: formatDate(quiz.timestamp),
    }));
    correct.value = results.reduce((sum, quiz) => sum + quiz.correct, 0);
    incorrect.value = results.reduce((sum, quiz) => sum + quiz.incorrect, 0);
    const total = correct.value + incorrect.value;
    accuracy.value = total ? (correct.value / total) * 100 : 0;
  } catch (error) {
    console.error("Erro ao buscar resultados:", error);
  }
});
</script>
