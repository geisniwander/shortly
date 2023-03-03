export async function postUrl(req, res) {
  try {
    res.status(201).send("Url encurtada com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getUrlById(req, res) {
  try {
    res.status(201).send("Url encontrada com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function openUrl(req, res) {
  try {
    res.status(201).send("Url encontrada com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteUrlById(req, res) {
  try {
    res.status(201).send("Url excluída com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}
