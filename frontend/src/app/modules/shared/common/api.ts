import { BASE_URL } from './constant';

export module API {
  export class USER {
    public static readonly URL = `${BASE_URL}/user`;

    public static readonly APPROVE_STATUS = `${USER.URL}/approval-status`;
    public static readonly APPROVE = `${USER.URL}/approve`;
    public static readonly DECLINE = `${USER.URL}/decline`;
    public static readonly REGISTER = `${USER.URL}/register`;
    public static readonly LOGIN = `${USER.URL}/login`;
    public static readonly EXIST_EMAIL = `${USER.URL}/exist-email`;
  }

  export class TOPIC {
    public static readonly URL = `${BASE_URL}/topic`;

    public static readonly GET_OPTIONS = `${TOPIC.URL}/select-options`;
  }

  export class DISCUSSION {
    public static readonly URL = `${BASE_URL}/discussion`;

    public static readonly SELECT_OPTIONS = `${DISCUSSION.URL}/select-options`;
  }

  export class THREAD {
    public static readonly URL = `${BASE_URL}/thread`;

    public static readonly VIEW = `${THREAD.URL}/view`;

    public static readonly PENDING = `${THREAD.URL}/pending`;
    public static readonly PIN = `${THREAD.URL}/pin`;
  }

  export class POST {
    public static readonly URL = `${BASE_URL}/post`;

    public static readonly VOTE = `${POST.URL}/vote`;

    public static readonly PENDING = `${POST.URL}/pending`;
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
