<template>
  <v-container class="d-flex align-center justify-center ma-0 pa-0" style="height: 100vh;">
    <v-card class="pa-10" elevation="3" style="width: 700px; max-width: 90%; min-height: 500px;">
        <v-row align="center" justify="center">
          <v-img src="/capelo.png" max-height="100" max-width="100" class="mr-3" alt="Capelo"></v-img>
          <h1 class="text-indigo-darken-4 mb-0" style="font-size: 36px;">Study Quiz - Módulo Aluno</h1>
        </v-row>

        <v-row class="mb-5" justify="center" align="center">
          <v-col cols="auto">
            <v-img src="/atuacao.png" alt="atuacao" style="width: 70px; height: 70px;" class="mr-3"></v-img>
          </v-col>
          <v-col>
            <v-btn
            style="background-color: cornflowerblue; color: white; width: 48%; font-size: 18px; padding: 12px; height: 50px;">
            Meu Desempenho
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="mb-5" justify="center" align="center">
          <v-col cols="auto">
            <v-img src="/ranking.png" alt="atuacao" style="width: 70px; height: 70px;" class="mr-3"></v-img>
          </v-col>
          <v-col>
            <v-btn
            style="background-color: cornflowerblue; color: white; width: 48%; font-size: 18px; padding: 12px; height: 50px;">
            Ranking da Turma
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="mb-5" justify="center" align="center">
          <v-col cols="auto">
            <v-img src="/play.png" alt="atuacao" style="width: 70px; height: 70px;" class="mr-3"></v-img>
          </v-col>
          <v-col>
            <v-btn
            style="background-color: cornflowerblue; color: white; width: 48%; font-size: 18px; padding: 12px; height: 50px;">
            Iniciar Quiz
            </v-btn>
          </v-col>
        </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const quizzes = ref([]);

// Cabeçalhos da tabela
const headers = [
  { text: "Nome do Quiz", value: "name", align: "start" },
  { text: "Ações", value: "actions", sortable: false },
];

</script>
