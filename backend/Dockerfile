FROM microsoft/dotnet:2.0-sdk
WORKDIR /src
COPY . .
EXPOSE 5000
RUN dotnet restore
WORKDIR ./ItForum
ENTRYPOINT ["dotnet", "run"]