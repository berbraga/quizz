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
        <template v-slot:thead>
            <thead>
              <tr>
                <th v-for="header in headers" :key="header.text" :align="header.align || 'center'" class="text-center">
                  {{ header.text }}
                </th>
              </tr>
            </thead>
          </template>
          <!-- Toolbar acima da tabela -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Lista de Perguntas</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="addQuestion">Adicionar Pergunta</v-btn>
              <v-btn color="primary" @click="fetchQuestions" class="ml-3">Atualizar</v-btn>
            </v-toolbar>
          </template>

          <!-- Botão de exclusão -->
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

// Roteamento
const router = useRouter();
const route = useRoute();

// Parâmetros e estado
const quizId = route.params.quizId; // ID do quiz obtido pela rota
const quizName = ref("Nome do Quiz"); // Nome do quiz (substitua ou carregue do Firestore, se necessário)
const questions = ref([]); // Lista de perguntas do quiz

// Usuário atual (substitua se necessário)
const user = JSON.parse(localStorage.getItem("user"));

// Cabeçalhos da tabela
const headers = [
  { text: "Texto da Pergunta", value: "text", align: "center" },
  { text: "Nível", value: "level", sortable: false, align: "center" },
  { text: "Respostas", value: "answers", sortable: false, align: "center"},
  { text: "Respostas Corretas", value: "correctAnswer", sortable: false, align: "center" },
  { text: "Ações", value: "actions", align: "center" },
];

// Função para buscar as perguntas do Firestore
const fetchQuestions = async () => {
  try {
    // Busca a coleção "items" dentro do documento do quiz
    const querySnapshot = await getDocs(collection(db, "questions", quizId, "items"));
    questions.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(), // Inclui todos os campos da pergunta
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
      // Exclui a pergunta pelo ID
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
  router.push(`/professor/${user.id}/quiz/${quizId}/add-question`);
};

// Carrega as perguntas quando o componente é montado
onMounted(fetchQuestions);
</script>

<style scoped>
/* Classes para aumentar as células da tabela */
.large-cell {
  font-size: 1.2rem; /* Aumenta o texto */
  padding: 20px 10px; /* Aumenta o espaçamento interno */
}

.large-row {
  height: 60px; /* Aumenta a altura das linhas */
}
</style>
