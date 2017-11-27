import { BASE_URL } from './constant';

export module API {
  export class USER {
    public static readonly URL = `${BASE_URL}/user`;

    public static readonly UNAPPROVE = `${USER.URL}/unapprove`;
    public static readonly APPROVE = `${USER.URL}/approve`;
    public static readonly DECLINE = `${USER.URL}/decline`;
    public static readonly REGISTER = `${USER.URL}/register`;
    public static readonly LOGIN = `${USER.URL}/login`;
    public static readonly EXIST_EMAIL = `${USER.URL}/exist-email`;
  }

  export class TOPIC {
    public static readonly URL = `${BASE_URL}/topic`;

    public static readonly GET_ALL = `${TOPIC.URL}/getAll`;
    public static readonly GET = `${TOPIC.URL}/get`;
    public static readonly GET_OPTIONS = `${TOPIC.URL}/getSelectOptions`;
    public static readonly CREATE = `${TOPIC.URL}/create`;
  }

  export class DISCUSSION {
    public static readonly URL = `${BASE_URL}/discussion`;

    public static readonly GET_ALL = `${DISCUSSION.URL}/getAll`;
    public static readonly GET = `${DISCUSSION.URL}/get`;
    public static readonly GET_OPTIONS = `${DISCUSSION.URL}/getSelectOptions`;
    public static readonly CREATE = `${DISCUSSION.URL}/create`;
  }

  export class THREAD {
    public static readonly URL = `${BASE_URL}/thread`;

    public static readonly VIEW = `${THREAD.URL}/view`;
    public static readonly VOTE = `${THREAD.URL}/vote`;
  }

  export class POST {
    public static readonly URL = `${BASE_URL}/post`;

    public static readonly VOTE = `${POST.URL}/vote`;
  }

  export class TAG {
    public static readonly URL = `${BASE_URL}/tag`;
  }

  export class STATISTIC {
    public static readonly URL = `${BASE_URL}/statistic`;

    public static readonly THREADS_PER_TOPIC = `${STATISTIC.URL}/threads-per-topic`;
    public static readonly POSTS_PER_TOPIC = `${STATISTIC.URL}/posts-per-topic`;
  }
}
