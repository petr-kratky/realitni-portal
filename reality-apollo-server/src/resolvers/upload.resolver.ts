import { resolverManager } from "./_resolver-manager";
import { FileResolver } from "../lib/upload/upload.resolver"

resolverManager.registerResolver(FileResolver);
