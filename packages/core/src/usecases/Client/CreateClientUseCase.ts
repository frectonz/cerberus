import { Authorizer } from "../../data/protocols/authorizer/Authorizer";
import { AddClientGateway } from "../../data/protocols/data-access/Client/AddClientGateway";
import { UnauthorizedError } from "../../data/protocols/errors/";
import { CreateClientPresenter } from "../../data/protocols/presenter";
import { CreateClientRequest } from "../../data/protocols/requests";
import { UseCase } from "../UseCase";

export class CreateClientUseCase implements UseCase {
  private authorizer: Authorizer;
  private addClient: AddClientGateway;
  private presenter: CreateClientPresenter;

  constructor(config: CreateClientUseCaseConfig) {
    this.addClient = config.addClient;
    this.presenter = config.presenter;
    this.authorizer = config.authorizer;
  }

  async execute(request: CreateClientRequest) {
    const authorized = await this.authorizer.isValid(
      request.encodedAdminPassword
    );

    if (!authorized) {
      throw new UnauthorizedError();
    }

    const client = await this.addClient.addClient({
      name: request.name,
    });

    this.presenter.present({
      id: client.getId(),
      name: client.getName(),
    });
  }
}
interface CreateClientUseCaseConfig {
  authorizer: Authorizer;
  addClient: AddClientGateway;
  presenter: CreateClientPresenter;
}
