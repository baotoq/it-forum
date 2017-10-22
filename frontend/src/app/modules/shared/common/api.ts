import { BASE_URL } from './constant';

export module API {
  export class USER {
    public static readonly URL = `${BASE_URL}/user`;

    public static readonly GET_ALL = `${USER.URL}/getAll`;
    public static readonly GET_UNCONFIRMED = `${USER.URL}/getUnconfirmed`;
    public static readonly CONFIRM = `${USER.URL}/confirm`;
    public static readonly CREATE = `${USER.URL}/create`;
    public static readonly LOGIN = `${USER.URL}/login`;
    public static readonly HAS_EMAIL = `${USER.URL}/hasEmail`;
  }

  export class TOPIC {
    public static readonly URL = `${BASE_URL}/topic`;

    public static readonly GET_ALL = `${TOPIC.URL}/getAll`;
    public static readonly GET = `${TOPIC.URL}/get`;
    public static readonly CREATE = `${TOPIC.URL}/create`;
  }

  export class DISCUSSION {
    public static readonly URL = `${BASE_URL}/discussion`;

    public static readonly GET_ALL = `${DISCUSSION.URL}/getAll`;
    public static readonly GET = `${DISCUSSION.URL}/get`;
    public static readonly CREATE = `${DISCUSSION.URL}/create`;
  }

  export class POST {
    public static readonly URL = `${BASE_URL}/post`;

    public static readonly GET_ALL = `${POST.URL}/getAll`;
    public static readonly GET = `${POST.URL}/get`;
    public static readonly CREATE = `${POST.URL}/create`;
    public static readonly VIEW = `${POST.URL}/view`;
    public static readonly VOTE = `${POST.URL}/vote`;
  }

  export class COMMENT {
    public static readonly URL = `${BASE_URL}/comment`;

    public static readonly CREATE = `${COMMENT.URL}/create`;
    public static readonly VOTE = `${COMMENT.URL}/vote`;
  }
}
