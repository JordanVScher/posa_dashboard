function submete() { // eslint-disable-line no-unused-vars
	const nome = document.getElementById('studentName').value;

	if (nome === '') {
		document.getElementById('alert').innerHTML = 'Campo nome não pode estar vazio!';
	} else {
		const serie = document.getElementById('serie').value;
		const turma = document.getElementById('turma').value;

		document.getElementById('studentName').value = '';
		document.getElementById('serie').value = '6';
		document.getElementById('turma').value = 'A';

		document.getElementById('alert').innerHTML = `Aluno(a) ${nome} ${serie} ${turma} adionado(a) com sucesso!`;
	}
}

