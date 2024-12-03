<template>
  <div>
    bernardo
  </div>
</template>

<script setup>
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.isStudent) {
    router.push('/sem-permissao'); // Redireciona para a página de sem permissão se não for professor
  }
});
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
