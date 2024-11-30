<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card elevation="4" class="pa-6" max-width="400">
      <v-card-title class="text-h5 justify-center">
        Login
      </v-card-title>
      <v-card-text>
        <v-form>
          <!-- Campo de Email -->
          <v-text-field
            label="Email"
            v-model="loginData.email"
            outlined
            clearable
            :rules="[rules.required, rules.email]"
          ></v-text-field>

          <!-- Campo de Senha -->
          <v-text-field
            label="Senha"
            v-model="loginData.password"
            outlined
            type="password"
            clearable
            :rules="[rules.required]"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex flex-column">
        <!-- Botão Entrar -->
        <v-btn
          color="primary"
          class="mb-3"
          block
          @click="handleLogin"
        >
          Entrar
        </v-btn>

        <!-- Botão Cadastrar -->
        <v-btn
          text
          block
          color="purple"
          @click="goToCadastro"
        >
          Cadastrar
        </v-btn>

        <!-- Botão Esqueceu a senha -->
        <v-btn
          text
          block
          color="error"
          @click="goToForgotPassword"
        >
          Esqueceu a senha?
        </v-btn>
      </v-card-actions>
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
            router.push("/aluno");
          } else {
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
