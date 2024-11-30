<template>
  <v-container class="py-5">
    <v-card>
      <v-card-title>
        Perguntas do Quiz: {{ quizName }}
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="questions"
          item-value="id"
          class="elevation-1"
          dense
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Lista de Perguntas</v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- Botão Adicionar Pergunta -->
              <v-btn color="success" @click="addQuestion">Adicionar Pergunta</v-btn>
              <v-btn color="primary" @click="fetchQuestions" class="ml-3">Atualizar</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon color="error" @click="deleteQuestion(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase";

const router = useRouter();
const route = useRoute();

const quizId = route.params.quizId; // Obtém o ID do quiz pela rota
const quizName = ref("Nome do Quiz"); // Nome do quiz (carregar se necessário)
const questions = ref([]);

// Define os cabeçalhos da tabela
const headers = [
  { text: "Pergunta", value: "question", align: "start" },
  { text: "Ações", value: "actions", sortable: false },
];

// Função para buscar as perguntas
const fetchQuestions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "questions", quizId, "items"));
    questions.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Perguntas carregadas:", questions.value);
  } catch (error) {
    console.error("Erro ao carregar perguntas:", error);
    alert("Erro ao carregar perguntas. Tente novamente.");
  }
};

// Função para excluir uma pergunta
const deleteQuestion = async (id) => {
  const confirmDelete = confirm("Você tem certeza que deseja excluir esta pergunta?");
  if (confirmDelete) {
    try {
      await deleteDoc(doc(db, "questions", quizId, "items", id));
      alert("Pergunta excluída com sucesso!");
      fetchQuestions(); // Atualiza a tabela após a exclusão
    } catch (error) {
      console.error("Erro ao excluir a pergunta:", error);
      alert("Erro ao excluir a pergunta. Tente novamente.");
    }
  }
};

// Função para adicionar uma nova pergunta
const addQuestion = () => {
  router.push(`/quiz/${quizId}/add-question`);
};

// Carrega as perguntas quando o componente é montado
onMounted(fetchQuestions);
</script>

<style scoped>
/* Estilização adicional, se necessário */
</style>
