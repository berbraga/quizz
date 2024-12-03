<template>
  <v-container class="py-5">
    <v-card>
      <v-card-title>
        Criar Novo Quiz
      </v-card-title>
      <v-card-text>
        <v-form>
          <!-- Campo para seleção de nível -->
          <v-select
            v-model="quizData.level"
            :items="levels"
            label="Escolha o nível"
            outlined
            clearable
            :rules="[rules.required]"
          ></v-select>

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
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { addData } from "@/services/firebase"; // Função para adicionar ao Firestore

const router = useRouter();

onMounted(() => {

const user = JSON.parse(localStorage.getItem('user'));

if (!user || user.isStudent) {
  router.push('/sem-permissao'); // Redireciona para a página de sem permissão se não for professor
}
});

// Dados do formulário
const quizData = reactive({
  name: "",
  level: "", // Adiciona o nível selecionado aqui
});

// Níveis disponíveis
const levels = ["Difícil", "Intermediário", "Fácil"]; // Array de opções para o select

// Regras de validação
const rules = {
  required: (value) => !!value || "Campo obrigatório",
};

// Função para criar um quiz
const createQuiz = async () => {
  if (quizData.name && quizData.level) {
    try {
      await addData("quizzes", null, {
        ...quizData,
        createdAt: new Date().toISOString(),
      });
      alert("Quiz criado com sucesso!");
      router.push(`/professor/${user.id}`); // Redireciona para a página de quizzes
    } catch (error) {

    }
  } else {
    alert("Por favor, preencha todos os campos.");
  }
};

// Função para voltar
const goBack = () => {
  router.push(`/professor/${user.id}`);
};
</script>

<style scoped>
/* Estilização adicional, se necessário */
</style>
