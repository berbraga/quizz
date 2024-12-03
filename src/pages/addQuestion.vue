<template>
  <v-container class="py-5">
    <v-card>
      <v-card-title>
        Adicionar Pergunta
      </v-card-title>
      <v-card-text>
        <v-form>
          <!-- Campo para a Pergunta -->
          <v-textarea
            label="Pergunta"
            v-model="questionData.text"
            outlined
            clearable
            :rules="[rules.required]"
          ></v-textarea>

            <v-select
              v-model="questionData.level"
              :items="['Difícil', 'Intermediário', 'Fácil']"
              label="Escolha o nível"
              outlined
              clearable
              :rules="[rules.required]"
          ></v-select>

          <!-- Respostas com Botão para Selecionar a Correta -->
          <v-row>
            <v-col cols="12" md="6" v-for="(answer, index) in questionData.answers" :key="index">
              <v-text-field
                :label="'Resposta ' + (index + 1)"
                v-model="questionData.answers[index]"
                outlined
                clearable
                :rules="[rules.required]"
              ></v-text-field>
              <v-btn
                :color="questionData.correctAnswer === index ? 'success' : 'default'"
                block
                @click="setCorrectAnswer(index)"
              >
                {{ questionData.correctAnswer === index ? "Correta" : "Selecionar como Correta" }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="addQuestion">Salvar</v-btn>
        <v-btn color="secondary" @click="goBack">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>

onMounted(() => {

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.isStudent) {
    router.push('/sem-permissao'); // Redireciona para a página de sem permissão se não for professor
  }
});

import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { addData } from "@/services/firebase";

const router = useRouter();
const route = useRoute();

const quizId = route.params.quizId; // Obtém o ID do quiz pela rota

const questionData = reactive({
  text: "", // Texto da pergunta
  answers: ["", "", "", ""], // Quatro respostas possíveis
  correctAnswer: null, // Índice da resposta correta
  level: ""
});

const rules = {
  required: (value) => !!value || "Campo obrigatório",
};

// Define qual resposta é a correta
const setCorrectAnswer = (index) => {
  questionData.correctAnswer = index;
};
const user = JSON.parse(localStorage.getItem('user'));
// Função para adicionar a pergunta ao Firestore
const addQuestion = async () => {
  if (
    questionData.text &&
    questionData.answers.every((a) => !!a) &&
    questionData.correctAnswer !== null
  ) {
    try {
      await addData(`questions/${quizId}/items`, null, {
        text: questionData.text,
        answers: questionData.answers,
        correctAnswer: questionData.correctAnswer,
        level: questionData.level
      });
      alert("Pergunta adicionada com sucesso!");
      router.push(`/professor/${user.id}/quiz/${quizId}/questions`); // Redireciona para a página de perguntas
    } catch (error) {
      console.error("Erro ao adicionar pergunta:", error);
      alert("Erro ao adicionar pergunta. Tente novamente.");
    }
  } else {
    alert("Por favor, preencha todos os campos corretamente.");
  }
};

// Função para voltar
const goBack = () => {
  router.push(`/professor/${user.id}/quiz/${quizId}/questions`);
};
</script>

<style scoped>
/* Estilização adicional, se necessário */
</style>
