<template>
  <v-container class="py-5 d-flex align-center justify-center" style="height: 100vh;">
    <v-card class="text-center" width="800px" max-width="600">
      <v-card-title>
        Responda o Quiz: {{ quizName }}
      </v-card-title>
      <v-card-text>
        <div v-if="questions.length">
          <!-- Pergunta Atual -->
          <div>
            <div class="d-flex">
              <h4 class="mb-5">{{ questions[currentQuestionIndex].text }}</h4>
              <v-spacer></v-spacer>
              <small>{{ questions[currentQuestionIndex].level }}</small>
            </div>
            <div class="d-flex flex-column align-center">
              <!-- Respostas como botões -->
              <v-btn
                v-for="(answer, i) in questions[currentQuestionIndex].answers"
                :key="i"
                class="my-2"
                color="primary"
                block
                @click="selectAnswer(i)"
              >
                {{ answer }}
              </v-btn>
            </div>
          </div>

          <!-- Timer -->
          <div class="mt-4">
            <h5>Tempo restante: {{ timer }} segundos</h5>
          </div>

          <!-- Navegação -->
          <div class="mt-4">
            <v-btn
              class="mx-4"
              v-if="currentQuestionIndex === questions.length - 1"
              color="success"
              @click="submitQuiz"
            >
              Enviar Respostas
            </v-btn>
          </div>
        </div>
        <div v-else>
          <p>Nenhuma pergunta encontrada para este quiz.</p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getDocs, collection, doc, updateDoc, arrayUnion } from "firebase/firestore"; // Importa arrayUnion
import { db } from "@/services/firebase";

const route = useRoute();
const router = useRouter();
const quizId = route.params.quizId; // Obtém o ID do quiz da rota
const quizName = ref("Quiz"); // Nome do quiz
const questions = ref([]); // Perguntas do quiz
const answers = ref([]); // Respostas selecionadas pelo aluno
const currentQuestionIndex = ref(0); // Índice da pergunta atual
const timer = ref(180); // Timer para cada pergunta
let timerInterval = null; // Armazena a referência do intervalo

// Função para buscar as perguntas do quiz
const fetchQuestions = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(db, `questions/${quizId}/items`)
    );
    const questionList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    questions.value = questionList;
    answers.value = Array(questionList.length).fill(null); // Inicializa respostas
    console.log()
    startTimer(); // Inicia o timer para a primeira pergunta
  } catch (error) {
    console.error("Erro ao carregar as perguntas:", error);
    alert("Erro ao carregar as perguntas. Tente novamente.");
  }
};

// Função para iniciar o timer
const startTimer = () => {
  timer.value = 180; // Reinicia o timer
  clearInterval(timerInterval); // Garante que não há outro timer rodando
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      // Quando o tempo acabar, passa para a próxima pergunta ou finaliza
      if (currentQuestionIndex.value < questions.value.length - 1) {
        nextQuestion();
      } else {
        clearInterval(timerInterval); // Para o timer
        submitQuiz(); // Finaliza o quiz
      }
    }
  }, 1000); // Atualiza a cada segundo
};

// Função para selecionar uma resposta
const selectAnswer = (index) => {
  answers.value[currentQuestionIndex.value] = index; // Define a resposta para a pergunta atual
  if (currentQuestionIndex.value < questions.value.length - 1) {
    nextQuestion(); // Avança para a próxima pergunta
  } else {
    submitQuiz(); // Finaliza o quiz na última pergunta
  }
};

// Navega para a próxima pergunta
const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
    startTimer(); // Reinicia o timer ao mudar de pergunta
  }
};

// Navega para a pergunta anterior
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    startTimer(); // Reinicia o timer ao mudar de pergunta
  }
};

// Função para enviar as respostas e salvar acertos/erros no Firestore
const submitQuiz = async () => {
  clearInterval(timerInterval); // Para o timer ao finalizar o quiz
  const user = JSON.parse(localStorage.getItem('user'));
  let correctCount = 0;

  // Conta as respostas corretas
  questions.value.forEach((question, index) => {
    if (answers.value[index] === question.correctAnswer) {
      correctCount++;
    }
  });

  const totalQuestions = questions.value.length;
  const incorrectCount = totalQuestions - correctCount; // Calcula erros
  const accuracy = ((correctCount / totalQuestions) * 100).toFixed(2);

  try {
    const user = JSON.parse(localStorage.getItem('user')); // Obtém o usuário atual
    const quizRef = doc(db, `quizzes/${quizId}`);
    const newResult = {
      userId: user?.id || 'guest', // ID do usuário ou 'guest'
      correct: correctCount,
      incorrect: incorrectCount,
      accuracy: parseFloat(accuracy),
      timestamp: new Date().toISOString(),
    };

    // Adiciona o resultado ao array no Firestore
    await updateDoc(quizRef, {
      results: arrayUnion(newResult), // Incrementa o array com o novo resultado
    });

    alert(
      `Você acertou ${correctCount} de ${totalQuestions} perguntas. Porcentagem de acerto: ${accuracy}%`
    );

  } catch (error) {
    console.error("Erro ao salvar os resultados:", error);
    alert("Erro ao salvar os resultados do quiz. Tente novamente.");
  }

  if(user.isStudent == false){
      router.push(`/professor/${user.id}`)
    }else{
      router.push(`/aluno/${user.id}`)
  }
};

// Carrega as perguntas quando o componente é montado
onMounted(fetchQuestions);

// Limpa o timer ao desmontar o componente
onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>


<style scoped>
/* Estilização adicional, se necessário */
</style>
