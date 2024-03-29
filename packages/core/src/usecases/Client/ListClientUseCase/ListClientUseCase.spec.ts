import { ListClientUseCase } from "./ListClientUseCase";
import {
  AcceptingAuthorizer,
  AuthorizerSpy,
  RejectingAuthorizer,
} from "@cerberus/core/protocols/authorizer/test/mockAuthorizer";
import { UnauthorizedError } from "@cerberus/core/protocols/errors";
import { ListClientGatewaySpy } from "@cerberus/core/protocols/data-access/Client/test";
import { ListClientPresenterSpy } from "@cerberus/core/protocols/presenter/Client/test";

describe("List Client Use Case", () => {
  it("throws the authorizer rejects", async () => {
    const authorizer = new RejectingAuthorizer();
    const listClients = new ListClientGatewaySpy();
    const presenter = new ListClientPresenterSpy();
    let error: Error = new Error();

    const usecase = new ListClientUseCase({
      authorizer,
      listClients,
      presenter,
    });

    try {
      await usecase.execute({
        encodedAdminPassword: "x",
        after: "after_id",
        limit: 15,
        sort: "+name",
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it("calls authorizer with the right argument", async () => {
    const authorizer = new AuthorizerSpy();
    const listClients = new ListClientGatewaySpy();
    const presenter = new ListClientPresenterSpy();

    const usecase = new ListClientUseCase({
      listClients,
      authorizer,
      presenter,
    });

    try {
      await usecase.execute({
        encodedAdminPassword: "encoded_password",
      });
    } catch {}

    expect(authorizer.calledWithPassword).toBe("encoded_password");
  });

  it("calls list clients with the right argument", async () => {
    const authorizer = new AcceptingAuthorizer();
    const listClients = new ListClientGatewaySpy();
    const presenter = new ListClientPresenterSpy();

    const usecase = new ListClientUseCase({
      listClients,
      authorizer,
      presenter,
    });

    try {
      await usecase.execute({
        encodedAdminPassword: "encoded_password",
      });
    } catch {}

    expect(listClients.called).toBe(true);
  });

  it("calls list clients presenter with the right argument", async () => {
    const authorizer = new AcceptingAuthorizer();
    const listClients = new ListClientGatewaySpy();
    const presenter = new ListClientPresenterSpy();

    const usecase = new ListClientUseCase({
      listClients,
      authorizer,
      presenter,
    });

    try {
      await usecase.execute({
        encodedAdminPassword: "encoded_password",
      });
    } catch {}

    expect(presenter.calledWithData[0].id).toBe("id");
    expect(presenter.calledWithData[0].name).toBe("client_name");
  });
});
