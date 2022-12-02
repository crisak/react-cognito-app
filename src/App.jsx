import { useEffect, useState } from "react";
import {
  createUser,
  getUser,
  removeUser,
  resentCode,
  validateCode,
} from "./services/cognitoServices";

const CLIENT_ID = "4frmj8o67uoclg12f33qjveqp";
// const POOL_ID = "us-east-1_l3KnFvKIP";
const USERNAME = "crisak";

const payloadInit = {
  ClientId: CLIENT_ID,
  Username: USERNAME,
  Password: "Temporal01#",
  UserAttributes: [
    { Name: "zoneinfo", Value: "America/Bogota" },
    { Name: "updated_at", Value: Date.now().toString() },
    { Name: "name", Value: "Cristian" },
    { Name: "nickname", Value: "crisak" },
    { Name: "phone_number", Value: "+573148554726" },
    { Name: "picture", Value: "https://localhost:3000/image.png" },
    { Name: "email", Value: "opencris28@gmail.com" },
  ],
};

const Link = ({ ...props }) => <a style={{ cursor: "pointer" }} {...props}></a>;

function App() {
  const [payload, setPayload] = useState(structuredClone(payloadInit));
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const [stateForm, setStateForm] = useState("createUser"); // confirmCode | removeUser

  const sendRequest = async (functionData, saveResponse = true) => {
    try {
      setLoading(true);
      const response = await functionData();
      if (saveResponse) setResponse(response);

      return response;
    } catch (error) {
      const message = error?.message || `Error request ${JSON.stringify(error)}`;
      if (saveResponse) setResponse(message);
    } finally {
      setLoading(false);
    }
  };

  const navbar = () => {
    return (
      <nav className="container">
        <ul>
          <li>
            <Link
              onClick={(e) => {
                e?.preventDefault();
                setStateForm("createUser");
              }}
            >
              Crear usuario
            </Link>
          </li>
          <li>
            <Link
              onClick={(e) => {
                e?.preventDefault();
                setStateForm("confirmCode");
              }}
            >
              Confirmar código
            </Link>
          </li>
          <li>
            <Link
              onClick={(e) => {
                e?.preventDefault();
                setStateForm("removeUser");
              }}
            >
              Eliminar usuario
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link
              onClick={() => {
                sendRequest(async () => {
                  const res = await getUser(payload.Username);
                  setUser(res);
                  return true;
                }, false);
              }}
            >
              Refresh user
            </Link>
          </li>
        </ul>
      </nav>
    );
  };

  const displayCreateUser = () => {
    return (
      <article className="card">
        <form
          className="card"
          onSubmit={async (e) => {
            e.preventDefault();
            await sendRequest(() => createUser(payload));
            sendRequest(async () => {
              const res = await getUser(payload.Username);
              setUser(res);
              return true;
            }, false);
          }}
        >
          <div className="margin padding">
            <span
              style={{ cursor: "pointer", float: "right" }}
              role={"link"}
              onClick={() => {
                console.log("payloadInit->", payloadInit);
                setPayload({ ...payloadInit });
              }}
            >
              Restaurar
            </span>
          </div>

          <label htmlFor="bodyUser">Payload for crear usuario</label>
          <textarea
            name="bodyData"
            id="bodyUser"
            cols="30"
            rows="10"
            onChange={(e) => {
              const value = e.target?.value || "{}";
              setPayload(JSON.parse(value));
            }}
            defaultValue={JSON.stringify(payload, null, 2)}
            value={JSON.stringify(payload, null, 2)}
          ></textarea>
          <br />
          <button type="submit">Crear usuario</button>
        </form>
      </article>
    );
  };

  const confirmCode = () => {
    return (
      <article>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await sendRequest(() => validateCode(code, payload.Username));

            sendRequest(async () => {
              const res = await getUser(payload.Username);
              setUser(res);
              return true;
            }, false);
          }}
        >
          <div>
            <label htmlFor="code">Confirmar código</label>
            <input
              type="text"
              id="code"
              value={code}
              placeholder="Ingrese el código"
              onChange={(e) => {
                const value = e.target.value;
                setCode(value);
              }}
            />
            <a
              className="cursor"
              onClick={(e) => {
                e?.preventDefault();
                sendRequest(() => resentCode(payload.Username));
              }}
            >
              Reenviar código
            </a>
          </div>
          <br />
          <button type="submit">Validar código</button>
        </form>
      </article>
    );
  };

  const deleteUser = () => {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendRequest(() => removeUser(payload.Username));

          sendRequest(async () => {
            const res = await getUser(payload.Username);
            setUser(res);
            return true;
          }, false);
        }}
      >
        <div>
          <label htmlFor="deleteUser">Eliminar usuario</label>
          <input
            type="text"
            id="deleteUser"
            value={payload.Username}
            placeholder="Ingrese el código"
            onChange={(e) => {
              const value = e.target.value;

              setPayload((prev) => {
                return {
                  ...prev,
                  Username: value,
                };
              });
            }}
          />
        </div>
        <br />

        <button type="submit">Eliminar usuario</button>
      </form>
    );
  };

  const aside = () => {
    if (!user?.UserStatus) {
      return null;
    }
    return (
      <aside role={"gridcell"}>
        <h3>Usuario registrado</h3>
        <article>
          <div role={"alert"}>
            <label>Estado del usuario: </label>
            <input
              style={{ cursor: "default" }}
              aria-invalid={user?.UserStatus !== "CONFIRMED"}
              value={user?.UserStatus}
              contentEditable={false}
            />
          </div>
          <br />
          <div role={"alert"}>
            <label>Numero teléfono: </label>
            <code>
              {JSON.stringify(
                user?.UserAttributes?.find(({ Name }) => Name === "phone_number_verified"),
                null,
                2
              )}
            </code>
          </div>
          <br />
          <div role={"alert"}>
            <label>Email verificado: </label>

            <code>
              {JSON.stringify(
                user?.UserAttributes?.find(({ Name }) => Name === "email_verified"),
                null,
                2
              )}
            </code>
          </div>
          <br />
          <div role={"alert"}>
            <details>
              <summary> Detalle del usuario</summary>
              <pre>
                <code>{JSON.stringify(user, null, 2)}</code>
              </pre>
            </details>
          </div>
        </article>
      </aside>
    );
  };

  useEffect(() => {
    sendRequest(async () => {
      const res = await getUser(payload.Username);
      setUser(res);
      return true;
    }, false);
  }, []);

  return (
    <div className="margin padding container">
      {navbar()}
      {loading && <div aria-busy="true"></div>}
      <div role={"grid"} className="grid">
        <main role={"gridcell"}>
          <header>
            <h3>
              State form: <b>{stateForm}</b>
            </h3>
          </header>

          {stateForm === "createUser" && displayCreateUser()}
          {stateForm === "confirmCode" && confirmCode()}
          {stateForm === "removeUser" && deleteUser()}
        </main>
        {aside()}
      </div>

      <footer>
        <div role={"alert"}>
          {response && (
            <pre>
              <code>{JSON.stringify(response, null, 2)}</code>
            </pre>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
