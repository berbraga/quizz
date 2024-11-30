<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card elevation="4" class="pa-6" max-width="500">
      <v-card-title class="text-h5 justify-center">
        Cadastro de Usuário
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid">
          <!-- Campo de Nome -->
          <v-text-field
            label="Nome"
            v-model="formData.name"
            outlined
            clearable
            :rules="[rules.required]"
          ></v-text-field>

          <!-- Campo de Email -->
          <v-text-field
            label="Email"
            v-model="formData.email"
            outlined
            clearable
            :rules="[rules.required, rules.email]"
          ></v-text-field>

          <!-- Campo de Senha -->
          <v-text-field
            label="Senha"
            v-model="formData.password"
            type="password"
            outlined
            clearable
            :rules="[rules.required, rules.password]"
          ></v-text-field>

          <!-- Campo de Confirmar Senha -->
          <v-text-field
            label="Confirmar Senha"
            v-model="formData.confirmPassword"
            type="password"
            outlined
            clearable
            :rules="[rules.required, confirmPasswordRule]"
          ></v-text-field>

          <!-- Checkbox: É Aluno -->
          <v-checkbox
            label="Sou aluno"
            v-model="formData.isStudent"
          ></v-checkbox>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex flex-column">
        <!-- Botão Cadastrar -->
        <v-btn
          color="primary"
          class="mb-3"
          block
          :disabled="!isFormValid"
          @click="handleRegister"
        >
          Cadastrar
        </v-btn>

        <!-- Botão Voltar -->
        <v-btn
          color="secondary"
          block
          @click="goBack"
        >
          Voltar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { addData, doesFieldValueExist } from "@/services/firebase";

const router = useRouter();

const formData = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  isStudent: false,
});

const isFormValid = ref(false);

const rules = {
  required: (value) => !!value || "Campo obrigatório",
  email: (value) => /\S+@\S+\.\S+/.test(value) || "E-mail inválido",
  password: (value) =>
    value.length >= 6 || "A senha deve ter pelo menos 6 caracteres",
};

// Regra para confirmar a senha
const confirmPasswordRule = (value) =>
  value === formData.password || "As senhas não coincidem";

// Lida com o cadastro
const handleRegister = async () => {
  if (formData.name && formData.email && formData.password === formData.confirmPassword) {
    try {
      const emailExists = await doesFieldValueExist("users", "email", formData.email);

      if (emailExists) {
        alert("Este e-mail já está cadastrado. Tente outro.");
      } else {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password, // Para produção, lembre-se de criptografar!
          isStudent: formData.isStudent,
          createdAt: new Date().toISOString(),
        };

        // Adiciona os dados no Firestore
        await addData("users", null, userData);
        alert("Cadastro realizado com sucesso!");
        router.push("/"); // Redireciona para a rota "/"
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Ocorreu um erro ao realizar o cadastro. Tente novamente.");
    }
  } else {
    alert("Por favor, preencha todos os campos corretamente.");
  }
};

// Lida com o botão "Voltar"
const goBack = () => {
  router.back(); // Volta para a página anterior
};
</script>

<style scoped>
/* Estilo adicional, se necessário */
</style>
