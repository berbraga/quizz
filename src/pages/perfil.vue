<template>
    <v-container class="d-flex align-center justify-center ma-0 pa-0" style="height: 100vh;">
        <v-card class="pa-10 d-flex flex-column" elevation="3" style="width: 700px; max-width: 90%; min-height: 500px;">

            <div align="center" justify="center">
                <v-img src="/perfil.png" max-height="100" max-width="100" class="mr-3" alt="Capelo"></v-img>
                <h1 class="text-indigo-darken-4 mt-5" style="font-size: 36px;">Informações do Usuário</h1>
            </div>

            <div class="d-flex flex-column">
                <div class="font-weight-medium ma-5 text-h5">Matrícula</div>
                <div class="font-weight-large ma-5 text-h5">{{user.id}}</div>


                <div class="font-weight-medium ma-5 text-h5">E-mail</div>
                <div class="font-weight-large ma-5 text-h5">{{user.email}}</div>


                <div class="font-weight-medium ma-5 text-h5">Nome</div>
                <div class="font-weight-large ma-5 text-h5">{{ user.name }}</div>
            </div>

            <div class="d-flex justify-center mt-10" width="100%">
                <v-btn class=""
                    style="background-color: cornflowerblue; color: white; font-size: 15px; padding: 10px; height: 40px;" @click="voltar">
                    Voltar
                </v-btn>
            </div>

        </v-card>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getData, doesFieldValueExist } from "@/services/firebase"; // Funções do Firestore

const router = useRouter();

const user = JSON.parse(localStorage.getItem('user'));
console.log(user);

const voltar = async () => {
    if(user.isStudent == false){
        router.push(`/professor/${user.id}`)
  }else{
        router.push(`/aluno/${user.id}`)
  }
}

</script>