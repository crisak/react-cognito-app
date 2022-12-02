const URL_API = "https://qj0xyceqr2.execute-api.us-east-1.amazonaws.com/default/create-user-test";

export const resentCode = async (username) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    action: "resentCode",
    username,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(URL_API, requestOptions).then((response) => response.json());
};

export const validateCode = async (code, username) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    action: "confirm",
    code,
    username,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(URL_API, requestOptions).then((response) => response.json());
};

export const createUser = async (payload) => {
  //   await timeData(2000);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    action: "create",
    payload,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(URL_API, requestOptions).then((response) => response.json());
};

export const removeUser = async (username) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    action: "remove",
    username,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(URL_API, requestOptions).then((response) => response.json());
};

export const getUser = async (username) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    action: "user",
    username,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(URL_API, requestOptions).then((response) => response.json());
};
