import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const primaryColor = '#3498db';
const secondColor ='#117372'
const successColor = '#2ecc71';
const errorColor = '#e74c3c';

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  text-align: center;
  margin: 50px;
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  border: 1px solid ${primaryColor};
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: ${successColor};
  }
`;

const Button = styled.button`
  padding: 10px;
  background-color: ${successColor};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #28b463;
  }
`;

const ErrorMessage = styled.p`
  color: ${errorColor};
  margin: 10px 0;
`;

const CryptoDetails = styled.div`
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 20px;
  background-color: #f9f9f9;
`;

const HighlightedTitle = styled.h2`
  color: ${primaryColor};
  margin-bottom: 15px;
`;

const HighlightedLabel = styled.span`
  font-weight: bold;
  color: ${secondColor};
`;


const VariationsTable = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: ${primaryColor};
  color: white;
  border: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;
const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid ${primaryColor};
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  margin-top: 20px;
`;

const CryptoList = () => {
  const [cryptoData, setCryptoData] = useState(null);
  const [newCryptoName, setNewCryptoName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCryptoId = async (cryptoName) => {
    setLoading(true);

    try {
      const response = await axios.get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map',
        {
          params: {
            symbol: cryptoName.toLowerCase(),
          },
          headers: {
            'X-CMC_PRO_API_KEY': '53f0cb46-52cc-4f1b-932d-1d747e2c1fda',
          },
        }
      );

      const cryptoId = response.data.data[0]?.id;

      if (cryptoId) {
        fetchData(cryptoId);
      } else {
        setError('Criptoativo não encontrado.');
        setCryptoData(null);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao obter dados da API:', error);
      setError(
        'Erro ao obter dados da API. Certifique-se de que o nome do criptoativo está correto.'
      );
      setCryptoData(null);
      setLoading(false);
    }
  };

  const fetchData = async (cryptoId) => {
    try {
      const response = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${cryptoId}`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': '53f0cb46-52cc-4f1b-932d-1d747e2c1fda',
          },
        }
      );

      const newCryptoData = response.data.data[cryptoId];

      if (newCryptoData) {
        setCryptoData(newCryptoData);
        setError('');
      } else {
        setError(
          'Erro ao obter dados da API. Certifique-se de que o nome do criptoativo está correto.'
        );
        setCryptoData(null);
      }
    } catch (error) {
      console.error('Erro ao obter dados da API:', error);
      setError(
        'Erro ao obter dados da API. Certifique-se de que o nome do criptoativo está correto.'
      );
      setCryptoData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrypto = async () => {
    if (!newCryptoName.trim()) {
      setError('Por favor, insira um nome de criptoativo válido.');
      return;
    }

    fetchCryptoId(newCryptoName);
  };

  return (
    <Container>
      <h1 style={{ color: primaryColor }}>Detalhes do Criptoativo</h1>

      <div>
        <Input
          type="text"
          placeholder="Digite o nome do criptoativo"
          value={newCryptoName}
          onChange={(e) => setNewCryptoName(e.target.value)}
        />
        <Button onClick={handleAddCrypto}>Recuperar Dados</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </div>

      {loading && (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Carregando dados...</p>
        </LoadingContainer>
      )}

      {cryptoData && (
        <CryptoDetails>
            <HighlightedTitle>{cryptoData.name}</HighlightedTitle>
          <p>
            <HighlightedLabel>Preço (USD):</HighlightedLabel> {cryptoData.quote.USD.price}
          </p>
          <p>
            <HighlightedLabel>Capitalização de Mercado (USD):</HighlightedLabel> {cryptoData.quote.USD.market_cap}
          </p>
          <p>
            <HighlightedLabel>Volume Diário (USD):</HighlightedLabel> {cryptoData.quote.USD.volume_24h}
          </p>
          <p>
            <HighlightedLabel>Variação nas Últimas 24 Horas:</HighlightedLabel> {cryptoData.quote.USD.percent_change_24h}%
          </p>
          <p>
            <HighlightedLabel>Fornecimento Circulante:</HighlightedLabel> {cryptoData.circulating_supply}
          </p>
          <VariationsTable>
            <thead>
              <tr>
                <TableHeader>Ranking</TableHeader>
                <TableHeader>Nome</TableHeader>
                <TableHeader>Preço (USD)</TableHeader>
                <TableHeader>Variação nas Últimas 24 Horas (%)</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell>{cryptoData.cmc_rank}</TableCell>
                <TableCell>{cryptoData.name}</TableCell>
                <TableCell>{cryptoData.quote.USD.price}</TableCell>
                <TableCell>{cryptoData.quote.USD.percent_change_24h}</TableCell>
              </tr>
            </tbody>
          </VariationsTable>
        </CryptoDetails>
      )}
    </Container>
  );
};

export default CryptoList;
