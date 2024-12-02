'use client';

type username = {
  username: string[] | undefined;
  width: number;
  height: number;
};

export default function NameComponents({ username, height }: username) {
  return (
    <div className="flex items-center">
      {username && username.length > 0 ? (
        <>
          {username?.map((el, key) => (
            <div key={key}>
              {el.toString().substring(0, 8) === 'https://' ? (
                <img
                  className={`mx-1 object-contain`}
                  style={{ height: height }}
                  alt="Custom Emoji In Username"
                  src={el}
                  key={key}
                />
              ) : (
                <span className="break-keep" key={key}>
                  {el}
                </span>
              )}
            </div>
          ))}
        </>
      ) : (
        <span className="loading loading-spinner loading-lg" />
      )}
    </div>
  );
}
