<template>
  <v-container class="d-flex align-center justify-center ma-0 pa-0" style="height: 100vh;">
    <v-card class="pa-10" elevation="3" style="width: 700px; max-width: 90%; height: 600px;">

      <v-row align="center" justify="center">
        <v-img
          src="/capelo.png"
          max-height="100"
          max-width="100"
          class="mr-3"
          alt="Capelo"
        ></v-img>
        <h1 class="text-blue mb-0" style="font-size: 36px;">Study Quiz</h1>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <v-row class="mb-5" justify="center" align="center">
        <v-col cols="auto">
          <v-img
            src="/login.png"
            alt="Login"
            style="width: 70px; height: 70px;"
            class="mr-3"
          ></v-img>
        </v-col>
        <v-col>
          <v-text-field
            label="Login"
            v-model="loginData.email"
            outlined
            clearable
            :rules="[rules.required, rules.email]"
            class="w-100"
            :style="{ backgroundColor: '#1E3A8A', color: 'white' }"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Campo de Senha -->
      <v-row class="mb-6" justify="center" align="center">
        <v-col cols="auto">
          <v-img
            src="/lock.png"
            alt="Cadeado"
            style="width: 70px; height: 70px;"
            class="mr-3"
          ></v-img>
        </v-col>
        <v-col>
          <v-text-field
            type="password"
            label="Senha"
            v-model="loginData.password"
            outlined
            clearable
            :rules="[rules.required]"
            class="w-100"
            :style="{ backgroundColor: '#1E3A8A', color: 'white' }"
          ></v-text-field>
        </v-col>

      </v-row>

      <v-row justify="space-between" class="mt-4">
        <v-btn
          class="d-flex align-center justify-center"
          style="background-color: cornflowerblue; color: white; width: 48%; font-size: 18px; padding: 12px; height: 50px;"
          block
          @click="goToCadastro"
        >
          Cadastrar
        </v-btn>
        <v-btn
          class="d-flex align-center justify-center"
          style="background-color: cornflowerblue; color: white; width: 48%; font-size: 18px; padding: 12px; height: 50px; margin-top: 15px;"
          block
          @click="handleLogin"
        >
          Entrar
        </v-btn>
      </v-row>

      <v-row justify="center" style="margin-top: 20px;">
        <a href="#" style="color: gray; font-size: 18px; text-decoration: none;" @click="goToForgotPassword">
          Esqueceu a senha?
        </a>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { getData, doesFieldValueExist } from "@/services/firebase"; // Funções do Firestore

const router = useRouter();

const loginData = reactive({
  email: "",
  password: "",
});

const rules = {
  required: (value) => !!value || "Campo obrigatório",
  email: (value) => /\S+@\S+\.\S+/.test(value) || "E-mail inválido",
};

// Função de Login
const handleLogin = async () => {
  if (loginData.email && loginData.password) {
    try {
      // Verifica se o email existe
      const emailExists = await doesFieldValueExist("users", "email", loginData.email);

      if (emailExists) {
        // Busca os dados do usuário pelo email
        const users = await getData("users");
        const user = users.find((user) => user.email === loginData.email);

        if (user && user.password === loginData.password) {
          if (user.isStudent) {
            // Redireciona para a rota do aluno
            localStorage.setItem('user', JSON.stringify(user));
            router.push("/aluno");
          } else {
            localStorage.setItem('user', JSON.stringify(user));
            // Redireciona para a rota do professor
            router.push("/professor");
          }
        } else {
          alert("Senha incorreta!");
        }
      } else {
        alert("Email não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao realizar login. Tente novamente.");
    }
  } else {
    alert("Por favor, preencha todos os campos.");
  }
};

// Redireciona para a rota de cadastro
const goToCadastro = () => {
  router.push("/cadastro");
};

// Redireciona para a rota de recuperação de senha
const goToForgotPassword = () => {
  router.push("/forgotpassword");
};
</script>

<style scoped>
/* Estilo adicional, se necessário */
</style>
