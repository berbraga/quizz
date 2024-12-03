<template>
  <v-container class="d-flex align-center justify-center ma-0 pa-0" style="height: 100vh;">
    <v-card class="text-center pa-5 elevation-3" width="400">
      <v-card-title class="justify-center">
        <v-icon size="80" color="red">mdi-alert-circle-outline</v-icon>
      </v-card-title>
      <v-card-text>
        <h3 class="mb-2">Sem Permissão</h3>
        <p class="text-body-2">Você não possui acesso a esta página ou recurso.</p>
      </v-card-text>
      <v-card-actions class="d-flex flex-column align-center">
        <v-btn color="primary" @click="goBack">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// Função para retornar à página anterior
const goBack = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    router.push('/login'); // Redireciona para a página de sem permissão se não for professor
  }else if(!user.isStudent){
    router.push(`/professor/${user.id}`)
  }else{
    router.push(`/aluno/${user.id}`)
  }

};
</script>

<style scoped>
/* Estilo adicional, caso necessário */
</style>