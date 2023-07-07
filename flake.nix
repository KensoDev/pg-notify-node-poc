{
  description = "Node 14 shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" "aarch64-darwin" ];
      perSystem = { config, self', inputs', pkgs, system, ... }: {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            postgresql_14
            gnused
            nodejs-slim-18_x
            yarn
            nodePackages.node-gyp-build
          ];
        };
      };
    };
}
