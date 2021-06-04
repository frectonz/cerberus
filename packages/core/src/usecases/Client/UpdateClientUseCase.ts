import { UseCase } from "../UseCase";
import { UnauthorizedError } from "../../data/protocols/errors";
import { Authorizer } from "../../data/protocols/authorizer/Authorizer";
import { UpdateClientGateway } from "../../data/protocols/data-access/Client/UpdateClientGateway";
import { UpdateClientPresenter } from "../../data/protocols/presenter";
import { UpdateClientRequest } from "../../data/protocols/requests";

export class UpdateClientUseCase implements UseCase {
  private authorizer: Authorizer;
  private updateClient: UpdateClientGateway;
  private presenter: UpdateClientPresenter;

  constructor(config: UpdateClientUseCaseConfig) {
    this.updateClient = config.updateClient;
    this.presenter = config.presenter;
    this.authorizer = config.authorizer;
  }

  async execute(request: UpdateClientRequest) {
    const authorized = await this.authorizer.isValid(
      request.encodedAdminPassword
    );

    if (!authorized) {
      throw new UnauthorizedError();
    }

    const client = await this.updateClient.updateClient(request.id, {
      name: request.name,
    });

    this.presenter.present({
      id: client.getId(),
      name: client.getName(),
    });
  }
}
interface UpdateClientUseCaseConfig {
  authorizer: Authorizer;
  updateClient: UpdateClientGateway;
  presenter: UpdateClientPresenter;
}
