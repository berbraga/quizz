<template>
  <v-container class="py-5">
    <v-card>
      <v-card-title>
        Responda o Quiz: {{ quizName }}
      </v-card-title>
      <v-card-text>
        <div v-if="questions.length">
          <div v-for="(question, index) in questions" :key="index" class="mb-5">
            <h4>{{ question.text }}</h4>
            <v-radio-group v-model="answers[index]" class="mt-3">
              <v-radio
                v-for="(answer, i) in question.answers"
                :key="i"
                :label="answer"
                :value="i"
              ></v-radio>
            </v-radio-group>
          </div>
          <v-btn color="success" @click="submitQuiz">Enviar Respostas</v-btn>
        </div>
        <div v-else>
          <p>Nenhuma pergunta encontrada para este quiz.</p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/services/firebase";

const route = useRoute();
const quizId = route.params.quizId; // Obtém o ID do quiz da rota
const quizName = ref("Quiz"); // Nome do quiz
const questions = ref([]); // Perguntas do quiz
const answers = ref([]); // Respostas selecionadas pelo aluno

// Função para buscar as perguntas do quiz
const fetchQuestions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, `questions/${quizId}/items`));
    const questionList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    questions.value = questionList;
    answers.value = Array(questionList.length).fill(null); // Inicializa respostas
    console.log(answers);
  } catch (error) {
    console.error("Erro ao carregar as perguntas:", error);
    alert("Erro ao carregar as perguntas. Tente novamente.");
  }
};

// Função para enviar as respostas e calcular a porcentagem de acerto
const submitQuiz = () => {
  let correctCount = 0;

  // Conta as respostas corretas
  questions.value.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correctCount++;
    }
  });

  // Calcula a porcentagem de acerto
  const totalQuestions = questions.value.length;
  const accuracy = ((correctCount / totalQuestions) * 100).toFixed(2);

  alert(`Você acertou ${correctCount} de ${totalQuestions} perguntas. Porcentagem de acerto: ${accuracy}%`);
};

// Carrega as perguntas quando o componente é montado
onMounted(fetchQuestions);
</script>

<style scoped>
/* Estilização adicional, se necessário */
</style>
