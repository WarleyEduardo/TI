/* cria dados dados padrao para teste
  1 - loja
  2 - usuario  tipo cliente e administrador 

*/

const mongoose = require('mongoose');
const { loja } = require('../config');
const Loja = mongoose.model('Loja');
const Usuario = mongoose.model('Usuario');
const Cliente = mongoose.model('Cliente');
const Categoria = mongoose.model('Categoria');
const Produto = mongoose.model('Produto');
const Variacao = mongoose.model('Variacao');
const Avaliacao = mongoose.model('Avaliacao');
const Pedido = mongoose.model('Pedido');
const Pagamento = mongoose.model('Pagamento');
const Entrega = mongoose.model('Entrega');

async function cadastrarloja (){

		dadosLoja = {
			nome: 'Loja Teste',
			cnpj: '19943902423401',
			email: 'loja@teste.com',
			telefones: ['(33) 1234-5678', '(33) 9876-5432'],
			endereco: {
				local: 'Rua teste',
				numero: '123',
				bairro: 'centro',
				cidade: 'Governador Valadares',
				CEP: '35100-000',
			},
		};
	
		let loja = await Loja.findOne({ email: 'loja@teste.com' });	

		if (!loja) {
			loja = new Loja(dadosLoja);
			loja.save();
	    }
	
	   		
		return loja._id;
  
}
	  

async function cadastrarusuario(loja) {

	dadosUsuario = {
	  nome: "admin",
	  email: "admin@teste.com",
	  password :'123456',
      loja,
	  permissao : ['cliente','admin']
	}


	  let usuario = await Usuario.findOne({ email: 'admin@teste.com' });

	
       if (!usuario) {
		   usuario = new Usuario(dadosUsuario);	
		   usuario.setSenha(dadosUsuario.password);
		   usuario.save();		  
	    }		   		
	   
		return usuario._id;		
}
	

async function cadastrarcliente(loja, usuario) {
	
	   
	const dadosCliente = {
		nome: 'Warley',
		cpf: '999.999.999-99',
		telefones: ['33 1234 5678'],
		endereco: {
			local: 'Rua teste',
			numero: '1',
			bairro: 'centro',
			cidade: 'Governador Valadares',
			estado: 'MG',
			CEP: '11234-123',
		},
		loja,
		dataDeNascimento: '2000-10-20',		
		usuario
	}; 
    
	let cliente = await Cliente.findOne({ cpf: '999.999.999-99' });		

	 if (!cliente) {
			cliente = new Cliente(dadosCliente);
			cliente.save();
		}	
		
	return cliente._id

}

async function cadastrarcategoria(loja) {
	
	dadosCategoria = {
		codigo: 'padrao',
		nome: 'Diversos',
		loja,
		disponibilidade: true,
	};


	let categoria = await Categoria.findOne({ codigo: 'padrao' });

	if (!categoria) {
		categoria = new Categoria(dadosCategoria);		
		categoria.save();
	}

	return categoria._id;
}

async function cadastrarproduto(loja,categoria) {
	
	dadosProduto = {
		titulo: 'produto teste',
		descricao: 'esse é um produto teste',
		preco: 15,
		promocao: 10,
		sku: 'a1b1c1',
		categoria,
		loja,
		disponibilidade: true,
	};

	let produto = await Produto.findOne({ sku: 'a1b1c1' });

	if (!produto) {
		produto = new Produto(dadosProduto);
		produto.save();
	}

	return produto._id;
}


async function cadastrarvariacao(loja,produto) {
	
	dadosVariacao = {
		quantidade: 30,
		codigo: 'variacaoPadrao',
		nome: 'P',
		preco: 15,
		promocao: 10,
		entrega: {
			dimensoes: {
				alturaCm: 15,
				larguraCm: 15,
				profundidadeCm: 15,
			},
			pesoKg: 0.5,
		},
		loja,
		produto
	};


	let variacao = await Variacao.findOne({ codigo: 'variacaoPadrao' });

	if (!variacao) {
		variacao = new Variacao(dadosVariacao);
		variacao.save();
	}

	return variacao._id;
}

async function cadastraravaliacao(loja, produto) {
	
	dadosAvaliacao ={
      nome: "otimo",
      texto: "produto muito bom ",
	  pontuacao: 5,
	  loja,
	  produto
	
    }


	let avaliacao = await Avaliacao.findOne({produto });

	if (!avaliacao) {
		avaliacao = new Avaliacao(dadosAvaliacao);
		avaliacao.save();
	}

	return avaliacao._id;
}

async function cadastrarpagamento(loja) {

	const dadosPagamento = {
		status: 'padrao',
		valor: 39.4,
		parcelas: 1,
		forma: 'boleto',
		endereco: {
			local: 'Rua teste',
			numero: '1',
			bairro: 'centro',
			cidade: 'Governador Valadares',
			estado: 'MG',
			CEP: '11234-123',
		},
		cartao: {},
		enderecoEntregaIgualCobranca: true,
		loja,
	};
	
		
	
	 const 	pagamento = new Pagamento(dadosPagamento);

	return  pagamento

}
 

async function cadastrarentrega(loja) {
  
	const dadosEntrega = {
		status: 'padrao' ,
		custo: 29.4,
		tipo: '41106',
		prazo: 6,
		endereco: {
			local: 'Rua teste',
			numero: '1',
			bairro: 'centro',
			cidade: 'Governador Valadares',
			estado: 'MG',
			CEP: '11234-123',
		},
		loja
	};

		
	const entrega = new Entrega(dadosEntrega);


	return entrega;
}




async function cadastrarpedido(loja, produto, variacao , cliente) {	
	
	dadosPedido =  {
		cliente,
		carrinho: [
			{
				produto,
				variacao,
				quantidade: 1,
				precoUnitario: 10,
			}
		],	

		loja,
	};	
	
		

	let pedido = await Pedido.findOne({ produto });	


	if (!pedido) {

		const pagamento = await cadastrarpagamento(loja);
		const entrega = await cadastrarentrega(loja);
         
		dadosPedido.entrega = entrega._id;
		dadosPedido.pagamento = pagamento._id;
		pedido = new Pedido(dadosPedido);
		pedido.save();
		entrega.pedido = pedido._id;
		entrega.save();
		pagamento.pedido = pedido._id;
		pagamento.save()


	}

	return pedido;
}




class DadosPadraoController {	
	
	async gerarDadosPadrao(req, res, next) {
  
		try {
			const loja = await cadastrarloja();
			const usuario = await cadastrarusuario(loja);
			const cliente = await cadastrarcliente(loja, usuario);
			const categoria = await cadastrarcategoria(loja);
			const produto = await cadastrarproduto(loja, categoria);
			const variacao = await cadastrarvariacao(loja, produto);
			const avaliacao = await cadastraravaliacao(loja, produto);
			const pedido = await cadastrarpedido(loja, produto, variacao ,cliente);
		
			res.send(pedido);
		} catch (e) {
			
			res.send({error :  e })
		}	
		
	}
}

module.exports = DadosPadraoController;