<template>
  <v-container class="py-5">
    <v-card>
      <v-card-title>
        Criar Novo Quiz
      </v-card-title>
      <v-card-text>
        <v-form>
          <!-- Campo para Nome do Quiz -->
          <v-text-field
            label="Nome do Quiz"
            v-model="quizData.name"
            outlined
            clearable
            :rules="[rules.required]"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="createQuiz">Salvar</v-btn>
        <v-btn color="secondary" @click="goBack">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { addData } from "@/services/firebase"; // Função para adicionar ao Firestore

const router = useRouter();

const quizData = reactive({
  name: "",
});

const rules = {
  required: (value) => !!value || "Campo obrigatório",
};

// Função para criar um quiz
const createQuiz = async () => {
  if (quizData.name) {
    try {
      await addData("quizzes", null, {
        ...quizData,
        createdAt: new Date().toISOString(),
      });
      alert("Quiz criado com sucesso!");
      router.push("/professor"); // Redireciona para a página de quizzes
    } catch (error) {
      console.error("Erro ao criar quiz:", error);
      alert("Erro ao criar quiz. Tente novamente.");
    }
  } else {
    alert("Por favor, preencha o nome do quiz.");
  }
};

// Função para voltar
const goBack = () => {
  router.push("/professor");
};
</script>

<style scoped>
/* Estilização adicional, se necessário */
</style>
