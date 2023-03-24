import { ReactNode, useContext, useState } from 'react';
import styled from 'styled-components';
import { Client } from 'xrpl';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  sendGetAddress,
  // shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  // ReconnectButton,
  GetXrpAddressButton,
  Card,
  GetXrpBalanceButton,
} from '../components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;
/*
const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;
*/
const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [xrpAddress, setXrpAddress] = useState<string>();
  const [xrpBalance, setXrpBalance] = useState<string>();
  const [isAccountFunded, setIsAccountFunded] = useState(true);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleGetAddressClick = async () => {
    try {
      const address = await sendGetAddress();
      console.log(`xrpAddress: ${address}`);
      if (typeof address === 'string') {
        setXrpAddress(address);
      }
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleGetBalanceClick = async () => {
    try {
      // Define the network client (testnet)
      const client = new Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();

      if (xrpAddress) {
        const balance = await client.getXrpBalance(xrpAddress);
        console.log(`XRP balance: ${balance}`);
        setXrpBalance(balance);
        setIsAccountFunded(true);
      }

      client.disconnect();
    } catch (e) {
      console.error(e);
      // dispatch({ type: MetamaskActions.SetError, payload: e });
      setIsAccountFunded(false);
    }
  };

  const getBalanceDescription = (): ReactNode => {
    if (!isAccountFunded) {
      return (
        <>
          Your account is unfunded. Send some reserve to <b>{xrpAddress}</b>
        </>
      );
    }

    // let balanceDescription: ReactNode = 'Get your XRP balance';
    if (xrpAddress && xrpBalance) {
      return (
        <>
          {xrpAddress} has <b>{xrpBalance} XRP</b>
        </>
      );
    }

    return 'Get your XRP balance';
  };

  return (
    <Container>
      <Heading>
        XRP <Span>with</Span> Metamask
      </Heading>
      <Subtitle>
        made by <Span>ripe.money</Span>
      </Subtitle>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        <Card
          content={{
            title: '1. Install Metamask Flask',
            description: "Metamask is world's most popular wallet",
            button: <InstallFlaskButton />,
          }}
          fullWidth
          disabled={state.isFlask}
        />
        <Card
          content={{
            title: '2. Install XRP Snap',
            description: 'Extend Metamask to work with XRP',
            button: (
              <ConnectButton
                onClick={handleConnectClick}
                disabled={!state.isFlask}
              />
            ),
          }}
          fullWidth
          disabled={!state.isFlask || Boolean(state.installedSnap)}
        />
        {/* {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will ' +
                'always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )} */}
        <Card
          content={{
            title: '3. Get XRP Address',
            description: xrpAddress || 'Get your XRP address from Metamask',
            button: (
              <GetXrpAddressButton
                onClick={handleGetAddressClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap || Boolean(xrpAddress)}
          fullWidth
        />
        <Card
          content={{
            title: '4. Check Account Balance',
            description: getBalanceDescription(),
            button: (
              <GetXrpBalanceButton
                onClick={handleGetBalanceClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap || !xrpAddress}
          fullWidth
        />
        {/* <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice> */}
      </CardContainer>
    </Container>
  );
};

export default Index;
